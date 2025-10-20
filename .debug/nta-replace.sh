#!/bin/sh

        # Enable tracing for debug; write both to workspace log and /tmp
        set -x
        LOG="/Users/mauro/Desktop/NoteTakingApp/.debug/nta-replace.log"
        TMPLOG=/tmp/nta-replace.log
        exec >> "$LOG" 2>&1
        echo "[replacement script] start: $(date -u)" >> "$TMPLOG" 2>&1
        echo "[replacement script] writing to workspace log: $LOG" >> "$TMPLOG" 2>&1

        # dump environment for debugging
        echo "env: "; env | sort | sed -n '1,200p' >> "$LOG" 2>&1

        # short sleep to allow processes to settle
        sleep 2

        # Wait for the app to exit (including helper processes), but avoid waiting forever.
        WAIT_MAX=30
        COUNT=0
        while true; do
          # look for the main binary or helper processes
          MATCHES=$(/usr/bin/pgrep -af "NTA.app/Contents/MacOS/NTA|NTA Helper" 2>/dev/null || true)
          FILTERED=$(printf "%s" "$MATCHES" | /usr/bin/grep -v -E 'nta-replace.sh|/bin/sh -c' || true)
          if [ -z "${FILTERED}" ]; then
            echo "No running NTA processes detected (proceeding)." >> "$LOG" 2>&1
            break
          fi
          echo "Waiting for NTA app/helper to exit... (waited ${COUNT}s)" >> "$LOG" 2>&1
          sleep 1
          COUNT=$((COUNT + 1))
          if [ $COUNT -ge $WAIT_MAX ]; then
              echo "Wait timeout after ${COUNT}s - attempting to terminate leftover NTA processes" >> "$LOG" 2>&1
            PIDS=$(/usr/bin/pgrep -u "$(whoami)" -f "NTA.app/Contents/MacOS/NTA|NTA Helper" || true)
            if [ -n "$PIDS" ]; then
              echo "Killing PIDs: $PIDS" >> "$LOG" 2>&1
              /bin/kill -TERM $PIDS 2>/dev/null || /bin/kill -9 $PIDS 2>/dev/null || true
            else
              echo "No PIDs found to kill" >> "$LOG" 2>&1
            fi
            sleep 1
            MATCHES=$(/usr/bin/pgrep -af "NTA.app/Contents/MacOS/NTA|NTA Helper" 2>/dev/null || true)
            FILTERED=$(printf "%s" "$MATCHES" | /usr/bin/grep -v -E 'nta-replace.sh|/bin/sh -c' || true)
            if [ -z "${FILTERED}" ]; then
              echo "Processes cleared after forced kill" >> "$LOG" 2>&1
              break
            fi
            echo "Processes still present after forced kill - proceeding with copy (may fail)" >> "$LOG" 2>&1
            break
          fi
        done

        # remove old app and copy new one (uses ditto to preserve metadata)
        if [ -d "/Users/mauro/Applications/NTA.app" ]; then
          echo "Removing old app: /Users/mauro/Applications/NTA.app" >> "$LOG" 2>&1
          rm -rf "/Users/mauro/Applications/NTA.app"
        fi

        # Run ditto and capture stdout/stderr
        echo "Starting ditto from /var/folders/35/w3n1r1r17h7553z73jkyb2500000gn/T/NTA-upd/NTA.app to /Users/mauro/Applications/NTA.app" >> "$LOG" 2>&1
        /usr/bin/ditto "/var/folders/35/w3n1r1r17h7553z73jkyb2500000gn/T/NTA-upd/NTA.app" "/Users/mauro/Applications/NTA.app" >> "$LOG" 2>&1
        RET=$?
        echo "ditto exit code: $RET" >> "$LOG" 2>&1
        echo "ditto exit code: $RET" >> "$TMPLOG" 2>&1

        # Try to open the replaced app and capture exit code
        echo "Attempting to open /Users/mauro/Applications/NTA.app" >> "$LOG" 2>&1
        /usr/bin/open "/Users/mauro/Applications/NTA.app" >> "$LOG" 2>&1 || true
        OPEN_RET=$?
        echo "open exit code: $OPEN_RET" >> "$LOG" 2>&1
        echo "open exit code: $OPEN_RET" >> "$TMPLOG" 2>&1

        # Write a small JSON sentinel so post-mortem checks can confirm outcome
        RESULT_FILE=/tmp/nta-replace-result.json
        printf '{"ts":"%s","ret":%d,"open":%d,"target":"%s"}
' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$RET" "$OPEN_RET" "/Users/mauro/Applications/NTA.app" > "$RESULT_FILE"
        echo "Wrote result sentinel to $RESULT_FILE" >> "$LOG" 2>&1
        echo "Wrote result sentinel to $RESULT_FILE" >> "$TMPLOG" 2>&1

        # Also write a workspace-local sentinel
        WORKSPACE_RESULT_PATH="/Users/mauro/Desktop/NoteTakingApp/.debug/nta-replace-result.json"
        printf '{"ts":"%s","ret":%d,"open":%d,"target":"%s"}
' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$RET" "$OPEN_RET" "/Users/mauro/Applications/NTA.app" > "$WORKSPACE_RESULT_PATH" || echo "Failed to write $WORKSPACE_RESULT_PATH" >> "$LOG" 2>&1
        echo "Wrote workspace sentinel to $WORKSPACE_RESULT_PATH" >> "$LOG" 2>&1
        echo "Replacement script finished at $(date -u)" >> "$LOG" 2>&1
        