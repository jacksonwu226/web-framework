# Models

Directory containing machine learning models, typically in .onnx format.

## Inference

### Input

Models ending in -preprocess expect input images normalized in the same way, i.e. mini-batches of 3-channel RGB images of shape (N x H x W x 3), where N is the batch size, and H and W are expected to be at least 224.

### Output

ImageNet based -preprocess models output a 1x1x1000 list object representing the raw scores of ImageNet classes.
