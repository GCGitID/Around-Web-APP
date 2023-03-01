package backend

import (
	"fmt"
	"io"

	"around/util"

	"github.com/huaweicloud/huaweicloud-sdk-go-obs/obs"
)

var (
	OBSBackend *ObjectStorageServiceBackend
)

type ObjectStorageServiceBackend struct {
	client   *obs.ObsClient
	bucket   string
	endPoint string
}

func InitOBSBackend(config *util.OBSInfo) {
	client, err := obs.New(config.OBS_AK, config.OBS_SK, config.OBS_EndPoint)
	if err != nil {
		panic(err)
	}

	OBSBackend = &ObjectStorageServiceBackend{
		client:   client,
		bucket:   config.OBS_Bucket,
		endPoint: config.OBS_EndPoint,
	}
}

func (backend *ObjectStorageServiceBackend) SaveToOBS(r io.Reader, objectName string) (string, error) {
	input := &obs.PutObjectInput{}
	input.Bucket = backend.bucket
	input.Key = objectName
	input.Body = r
	output, err := backend.client.PutObject(input)
	if err != nil {
		panic(err)
	}
	if output.ObjectUrl == "" {
		output.ObjectUrl = fmt.Sprintf("http://%s.%s/%s", backend.bucket, backend.endPoint, input.Key)
	}
	fmt.Printf("File is saved to OBS: %s\n", output.ObjectUrl)
	return output.ObjectUrl, nil
}

func (backend *ObjectStorageServiceBackend) DeleteFromOBS(objectName string) error {
	input := &obs.DeleteObjectInput{}
	input.Bucket = backend.bucket
	input.Key = objectName

	_, err := backend.client.DeleteObject(input)
	return err
}
