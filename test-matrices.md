# Matrix Test File

## Testing Matrix Creation with =x Syntax

### Standard matrices
&matrix 2x2
&bmatrix 3x3
&pmatrix 2x3

### Matrices with fill values
&matrix 2x2=x
&bmatrix 3x3=0
&pmatrix 2x3=\alpha
&vmatrix 3x3=1

### Tables with fill values
&table 2x3=data
&table 3x2=value

## Smart Fill Value Updating Test

**Instructions for testing:**
1. Create a matrix: `&matrix 3x3=x`
2. Manually edit one or two cells (e.g., change an 'x' to '42')
3. Change the fill value: `&matrix 3x3=0`
4. **Result:** All 'x' values become '0', but '42' stays as '42'!

**Test scenarios:**
- Create `&bmatrix 2x2=alpha` then change to `&bmatrix 2x2=beta`
- Create `&pmatrix 3x2=1` then change to `&pmatrix 3x2=0`
- Works with all matrix types: matrix, bmatrix, pmatrix, vmatrix, Bmatrix, Vmatrix

## Direct insertion tests

Use **Cmd+Shift+M** to insert matrices:
- matrix3x3=x
- matrix2x2=0  
- identity3x3
- table4x3=content

## Keyboard Shortcuts
- **Cmd+Shift+M**: Quick matrix/table insertion
- **Cmd+Shift+T**: Templates modal
- **Enter** after inline commands like `&matrix 3x3=x`

Test completed.
