#!/usr/bin/env python3

def hello_world():
    print("Hello, world!")

def calculate_pi(n_terms):
    pi = 0
    for k in range(n_terms):
        pi += (1 / 16**k) * (
            4 / (8*k + 1) -
            2 / (8*k + 4) -
            1 / (8*k + 5) -
            1 / (8*k + 6)
        )
    return pi

if __name__ == "__main__":
    hello_world()
    print(f"Pi approximation: {calculate_pi(10)}")