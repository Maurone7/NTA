# Rayleigh-Ritz

![[Rayleigh-Ritz part1]]

$$
\pi=U+V
$$

$$
\phi=a_1\phi_1+a_2\phi_2=a_1\sin\frac{\pi x}{L}+a_2\sin{\frac{2\pi x}{L}}
$$

$$U=\frac{EI}{2}\int_0^L\left(\frac{d^2\phi}{dx^2}\right)^2dx$$

$$
\frac{d\phi}{dx}=\frac{a_1\pi}{L}\cos \frac{\pi x}{L}+\frac{2a_2\pi}{L}\cos \frac{\pi x}{L}
$$

$$
\frac{d^2\phi}{dx^2}=-\frac{a_1\pi^2}{L^2}\sin \frac{\pi x}{L}-\frac{4a_2\pi^2}{L^2}\sin \frac{\pi x}{L}
$$

$A=a_1\frac{\pi^2}{L^2}$
$B=a_2\frac{4\pi^2}{L^2}$

$$U=-\frac{EI}{2}\int_0^LAsin \frac{\pi x}{L}+B\sin \frac{\pi x}{L}dx$$

$$
U=-\frac{1}{4}EIL\left(a_1^2(\frac{\pi}{L})^4+a_2^2(\frac{2\pi}{L})^4\right)
$$

$$V=-\int_0^Lp_z(x)\phi(x)dx$$

$$V=-p_z\int_0^L\phi(x)dx$$

$$
V=2p_z\left(a_2\frac{L}{2\pi}-a_1\frac{L}{\pi}        \right)
$$

$$
\pi=U+V=-\frac{1}{4}EIL\left(a_1^2(\frac{\pi}{L})^4+a_2^2(\frac{2\pi}{L})^4\right)+2p_z\left(a_2\frac{L}{2\pi}-a_1\frac{L}{\pi}        \right)
$$

$$
\frac{\partial{\pi}}{\partial{a_1}}=0=-\frac{2}{L}EIL\left(a_1(\frac{\pi}{L})^4\right)-2p_z\frac{L}{\pi}
$$

$\rightarrow a_1=-\frac{4p_z}{EIL}(\frac{L}{\pi})^5$
$$
\frac{\partial{\pi}}{\partial{a_2}}=0
$$
$\rightarrow a_2=\frac{4p_z}{EIL}(\frac{L}{2\pi})^5$


![[Rayleigh-Ritz part2]]

$$V=-\int_0^Lp_z(x)\phi(x)dx$$

$$V=-\int_0^LA\sin(\frac{2\pi x}{L})(a_1\sin\frac{\pi x}{L}+a_2\sin{\frac{2\pi x}{L}})
$$
$V=-\frac{A}{2}a_2L$

$\pi=-\frac{1}{4}EIL\left(a_1^2(\frac{\pi}{L})^4+a_2^2(\frac{2\pi}{L})^4\right)-\frac{A}{2}a_2L$

$$
\frac{\partial{\pi}}{\partial{a_1}}=0
$$

$\rightarrow a_1=0$

$$
\frac{\partial{\pi}}{\partial{a_2}}=0
$$

$\rightarrow a_2=-\frac{A}{EI}(\frac{L}{2\pi})^4$