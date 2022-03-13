// select element
const imagePickerElement = document.querySelector('#image-upload-control input');
const imagePreviewElement = document.querySelector('#image-upload-control img');

// function to fire on event
function updateImagePreview () {
  const files = imagePickerElement.files; // returns 1 element array
  // no file picked
  if (!files || files.length === 0) {
    // hide image preview
    imagePreviewElement.styles.display = 'none';
    return;
  }
  const pickedFile = files[0];
  // add file path on client PC and set as source
  imagePreviewElement.src = URL.createObjectURL(pickedFile);
  // make element visible
  imagePreviewElement.style.display = 'block';
}

// event listeners
imagePickerElement.addEventListener('change', updateImagePreview);