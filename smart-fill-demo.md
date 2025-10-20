# Smart Fill Value Update Demo

## How It Works

When you change the fill value (the part after `=`), the system intelligently:
- ✅ **Updates all cells** that contain the old fill value
- ✅ **Preserves manually edited cells** (cells you've customized)
- ✅ **Fills new cells** with the new fill value when resizing

## Step-by-Step Demo

### Step 1: Create initial matrix
Type: `&matrix 3x3=x` and press Enter

### Step 2: Edit some cells manually
Edit the matrix to replace some 'x' values with custom content like:
- Change one 'x' to '42'
- Change another 'x' to 'custom'

### Step 3: Update fill value
Type: `&matrix 3x3=0` and press Enter

**Result:** All remaining 'x' values become '0', but '42' and 'custom' stay unchanged!

## Test Cases

### Matrix Types
&matrix 2x2=alpha
&bmatrix 2x2=beta
&pmatrix 2x2=gamma
&vmatrix 2x2=delta
&Bmatrix 2x2=epsilon
&Vmatrix 2x2=zeta

### Table Tests
&table 2x3=old_value
&table 3x2=new_value

## Advanced Features

### Resize with Fill Value Update
1. Start: `&matrix 2x2=a`
2. Resize and change fill: `&matrix 3x3=b`
   - Old 'a' values → 'b'
   - New cells → 'b'
   - Manual edits → preserved

### Complex Fill Values
&matrix 2x2=α_{ij}
&bmatrix 3x3=\sin(x)
&pmatrix 2x3=f(x,y)

Test complete - try changing the fill values above!