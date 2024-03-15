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
Loading context...
{
  input: "how to visualize binaries data ? https://corte.si/posts/visualisation/entropy/index.html",
  chat_history: [],
  context: [
    Document {
      pageContent: "corte.si\n  \n  \n    Visualizing entropy in binary files\n  \n  2012-01-04\n  \n    Edit: Since this post, I've created an interactive tool for binary\nvisualisation - see it at binvis.io\nLast week, I wrote about visualizing binary files using space-filling\ncurves, a technique I use when I need to\nget a quick overview of the broad structure of a file. Today, I'll show you an\nelaboration of the same basic idea - still based on space-filling curves, but\nthis time using a colour function that measures local entropy.\nBefore I get to the details, let's quickly talk about the motivation for a\nvisualization like this. We can think of entropy as the degree to which a chunk\nof data is disordered. If we have a data set where all the elements have the\nsame value, the amount of disorder is nil, and the entropy is zero. If the data\nset has the maximum amount of heterogeneity (i.e. all possible symbols are\nrepresented equally), then we also have the maximum amount of disorder, and thus",
      metadata: [Object ...],
    }, Document {
      pageContent: "entropy measure to\ncalculate byte entropy over a sliding window. This gives us a \"local entropy\"\nvalue for each byte, even though the concept doesn't really apply to single\nsymbols.\nWith that out of the way, let's look at some pretty pictures.\nVisualizing the OSX ksh binary\nIn my previous post, I used the ksh\nbinary as a guinea pig, and I'll do the same here. On the left is the entropy\nvisualization with colours ranging from black for zero entropy, through shades\nof blue as entropy increases, to hot pink for maximum entropy. On the right is\nthe Hilbert curve visualization from the last post for comparison - see the\npost itself for an explanation of the\ncolour scheme. Click for larger versions with much more detail:",
      metadata: [Object ...],
    }, Document {
      pageContent: "set has the maximum amount of heterogeneity (i.e. all possible symbols are\nrepresented equally), then we also have the maximum amount of disorder, and thus\nthe maximum amount of entropy. There are two common types of high-entropy data\nthat are of special interest to reverse engineers and penetration testers. The\nfirst is compressed data - finding and extracting compressed sections is a\ncommon task in many security audits. The second is cryptographic material -\nwhich is obviously at the heart of most security work. Here, I'm referring not\nonly to key material and certificates, but also to hashes and actual encrypted\ndata. As I show below, a tool like the one I'm describing today can be highly\nuseful in spotting this type of information.\nFor this visualization, I use the Shannon\nentropy measure to\ncalculate byte entropy over a sliding window. This gives us a \"local entropy\"\nvalue for each byte, even though the concept doesn't really apply to single\nsymbols.",
      metadata: [Object ...],
    }, Document {
      pageContent: "encodings. If you're interested, here's\nthe culprit in all its repetitive\nglory.\nThe code\nAs usual, the code for generating all of the images in this post is up on\nGitHub. The entropy visualizations were created with\nbinvis, a new addition\nto scurve, my compendium of code related\nto space-filling curves.",
      metadata: [Object ...],
    }
  ],
  answer: " The context describes a method for visualizing binary files using space-filling curves and calculating local entropy for each byte. The visualization shows the entropy values with colors ranging from black for zero entropy to hot pink for maximum entropy. This method can be useful for reverse engineers and penetration testers to spot compressed data or cryptographic material in a binary file. You can find the code for generating these images on GitHub, specifically in binvis, which is a new addition to scurve.",
}
```
