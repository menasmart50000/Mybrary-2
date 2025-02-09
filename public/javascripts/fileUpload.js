// Register FilePond plugins
FilePond.registerPlugin(
    FilePondPluginFileEncode,
    FilePondPluginImageResize,
    FilePondPluginImagePreview
);

// Set FilePond options
FilePond.setOptions({
    styleItemPanelAspectRatio: 150 / 100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
});

// Parse the document for FilePond inputs
FilePond.parse(document.body);

console.log("FilePond initialized!");