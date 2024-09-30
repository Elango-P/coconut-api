
const S3 = require("../lib/s3");

const { Media } = require("../db").models;


class MediaService {
    //Upload Media
    async  uploadMedia(file, mediaId, fileName, isPublic, compressImage) {
        try {
            if (!file && !fileName && !mediaId) {
                return null;
            }
    
            fileName = fileName.trim();
    
            const filePath = `${mediaId}-${fileName}`;

    
                await new Promise((resolve, reject) => {
                    S3.uploadFile(file, filePath, isPublic,compressImage,  (err) => {
                        if (err) reject(err);
                        resolve({ message: "File Uploaded" });
                    });
                });
        } catch (error) {
            console.log(error);
        }
    }

    async  uploadPdfFile(file, mediaId, fileName, isPublic) {
        try {
            if (!file && !fileName && !mediaId) {
                return null;
            }
    
            fileName = fileName.trim();
    
            const filePath = `${mediaId}-${fileName}`;
            const fileExtension = fileName.split('.').pop().toLowerCase();

    
          if (fileExtension === 'pdf') {
                await new Promise((resolve, reject) => {
                    S3.uploadPdfFile(file, filePath, isPublic, (err) => {
                        if (err) reject(err);
                        resolve({ message: "Pdf file uploaded" });
                    });
                });
            } else {
                console.log("Unsupported file format");
                // Handle unsupported file format here if needed
            }
        } catch (error) {
            console.log(error);
        }
    }
    async  uploadVideoFile(file, mediaId, fileName, isPublic) {
        try {
            if (!file && !fileName && !mediaId) {
                return null;
            }
    
            fileName = fileName.trim();
    
            const filePath = `${mediaId}-${fileName}`;
            const fileExtension = fileName.split('.').pop().toLowerCase();

    
          if (fileExtension === 'mp4' || fileExtension === 'pdf') {
                    S3.uploadVideoToS3(file, filePath, isPublic).then((uploadUrl) => {
                        console.log('Upload');
                      })
                      .catch((error) => {
                        console.log(error);
                      });
            } 
        } catch (error) {
            console.log(error);
        }
    }


    //Delete Media
    async deleteMedia(filePath) {
        try {
            if (!filePath) {
                return null;
            }
            await new Promise((resolve, reject) => {
                S3.delFile(filePath, (err) => {
                    if (err) reject(err);
                    resolve({ message: "File Deleted" });
                });
            });
        } catch (error) {
            console.log(error);
        }
    }


    async updateFeature(objectId, objectName, companyId) {
        try {
            
        if (objectId && companyId && objectName) {
            //get all media list
            let mediaList = await Media.findAll({
                where: { object_id: objectId, object_name: objectName, company_id: companyId, feature: true }
            })

            //validate media list exist or not
            if (mediaList && mediaList.length > 0) {
                //loop the media list
                for (let i = 0; i < mediaList.length; i++) {
                    //destructure the media list
                    const { id } = mediaList[i];
                    //update the media
                    await Media.update({ feature: false }, {
                        where: { id: id, object_id: objectId, object_name: objectName, company_id: companyId, }
                    })

                }
            }
        }
    } catch (err) {
            console.log(err);
    }

    }

    async  uploadAudioFile(file, mediaId, fileName, isPublic) {
        try {
            if (!file && !fileName && !mediaId) {
                return null;
            }
    
            fileName = fileName.trim();
    
            const filePath = `${mediaId}-${fileName}`;
            const fileExtension = fileName.split('.').pop().toLowerCase();
    
          if (fileExtension === 'm4a') {
                    S3.uploadAudioToS3(file, filePath, isPublic).then((uploadUrl) => {
                        console.log('Upload');
                      })
                      .catch((error) => {
                        console.log(error);
                      });
            } 
        } catch (error) {
            console.log(error);
        }
    }
}

const mediaService = new MediaService();

module.exports = mediaService;
