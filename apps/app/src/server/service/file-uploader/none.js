// crowi-fileupload-none

module.exports = function(crowi) {
  const debug = require('debug')('growi:service:fileUploaderNone');
  const Uploader = require('./uploader');
  const lib = new Uploader(crowi);

  lib.getIsUploadable = function() {
    return false;
  };

  lib.deleteFile = function(filePath) {
    debug(`File deletion: ${filePath}`);
    throw new Error('not implemented');
  };

  lib.deleteFiles = function(filePath) {
    debug(`File deletion: ${filePath}`);
    throw new Error('not implemented');
  };

  lib.uploadAttachment = function(filePath, contentType, fileStream, options) {
    debug(`File uploading: ${filePath}`);
    throw new Error('not implemented');
  };

  lib.saveFile = async function({ filePath, contentType, data }) {
    debug(`File saving: ${filePath}`);
    throw new Error('not implemented');
  };


  lib.generateUrl = function(filePath) {
    // eslint-disable-next-line max-len
    return 'data:image/png;base64,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';
  };

  lib.listFiles = async function() {
    // "app:fileUploadType" defaults to "none" and it cannot be set back to "none" once it is configured;
    // wherefore, it is safe to assume no files have been uploaded.
    return [];
  };

  return lib;
};
