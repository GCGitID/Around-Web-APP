package util

import (
	"io/ioutil"
	"path/filepath"

	"gopkg.in/yaml.v2"
)

type ElasticsearchInfo struct {
	ES_URL      string `yaml:"es_url"`
	ES_Username string `yaml:"es_username"`
	ES_Password string `yaml:"es_password"`
}

type OBSInfo struct {
	OBS_Bucket   string `yaml:"obs_bucket"`
	OBS_AK       string `yaml:"obs_ak"`
	OBS_SK       string `yaml:"obs_sk"`
	OBS_EndPoint string `yaml:"obs_endpoint"`
}

type TokenInfo struct {
	Secret string `yaml:"secret"`
}

type ApplicationConfig struct {
	ElasticsearchConfig *ElasticsearchInfo `yaml:"elasticsearch"`
	OBSConfig           *OBSInfo           `yaml:"obs"`
	TokenConfig         *TokenInfo         `yaml:"token"`
}

func LoadApplicationConfig(configDir, configFile string) (*ApplicationConfig, error) {
	content, err := ioutil.ReadFile(filepath.Join(configDir, configFile))
	if err != nil {
		return nil, err
	}

	var config ApplicationConfig
	err = yaml.Unmarshal(content, &config)
	if err != nil {
		return nil, err
	}
	return &config, nil
}
