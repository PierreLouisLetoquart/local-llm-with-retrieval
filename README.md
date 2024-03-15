# 3-clean-llm

Simple local llm with file retrieval and context extraction.

If your input contains a URL, the program will retrieve the content of the page and extract the relevant information.

## Make it work

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## Example

Input :

```bash
==> How to visualize binaries data ? https://corte.si/posts/visualisation/entropy/index.html
```

Output :

```bash
(system) ==> Loading context...Done
(assistant) ==> Thinking...
(assistant) ==>  The context describes a method for visualizing binary files using space-filling curves and a color function that measures local entropy. Entropy is a measure of the degree of disorder or randomness in a set of data, with high entropy indicating maximum heterogeneity and maximum disorder. This technique can be useful for reverse engineers and penetration testers to identify compressed data and cryptographic material in binary files. The code for generating these visualizations is available on GitHub under the project named "scurve" and specifically in a new addition called "binvis". To summarize, you can visualize binary data using entropy visualization with colors ranging from black for zero entropy to hot pink for maximum entropy, and compare it to Hilbert curve visualization for better understanding of the file structure.
```
