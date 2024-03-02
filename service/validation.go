package main

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"errors"
	"log"
	"strconv"
	"strings"
	"time"
)

// pkcs5UnPadding removes padding from a slice of bytes using PKCS#5.
func pkcs5UnPadding(origBytes []byte) ([]byte, error) {
	length := len(origBytes)
	if length == 0 {
		return nil, errors.New("empty input slice")
	}

	unpadding := int(origBytes[length-1])
	if unpadding >= length {
		return nil, errors.New("invalid padding value")
	}

	return origBytes[:(length - unpadding)], nil
}

func aesDecrypt(decodedBytes []byte, ivString string, key string) ([]byte, error) {
	keyBytes := []byte(key)

	block, err := aes.NewCipher(keyBytes)
	if err != nil {
		return nil, err
	}

	iv := []byte(ivString)

	blockMode := cipher.NewCBCDecrypter(block, iv)
	origBytes := make([]byte, len(decodedBytes))

	// Ensure that decodedBytes has a length multiple of the block size
	if len(decodedBytes)%aes.BlockSize != 0 {
		return nil, errors.New("invalid byte array input")
	}

	blockMode.CryptBlocks(origBytes, decodedBytes)
	origBytes, err = pkcs5UnPadding(origBytes)

	return origBytes, err
}

func extractIVAndEncodedString(token string) (string, string, error) {
	if len(token) < 16 {
		return "", "", errors.New("invalid token")
	}

	iv := token[:16]
	encodedString := token[16:]

	return iv, encodedString, nil
}

func extractEpochAndEncodedKey(plaintextString string) (int64, string, error) {
	epochString := plaintextString[:10]
	encodedKey := plaintextString[10:]

	// Convert string to int64
	epochInt64, err := strconv.ParseInt(epochString, 10, 64)
	if err != nil {
		log.Println("Error parsing epoch string:", err)
		return 0, "", errors.New("invalid timestamp")
	}

	return epochInt64, encodedKey, nil
}

func validateToken(authorizationHeader string) bool {
	token := strings.TrimPrefix(authorizationHeader, "Bearer ")

	log.Println("token:", token)

	ivString, encodedString, err := extractIVAndEncodedString(token)
	if err != nil {
		log.Println(err)
		return false
	}

	key, err := secretCache.GetSecretString(secretName)
	if err != nil {
		log.Println(err)
		return false
	}

	decodedBytes, _ := base64.StdEncoding.DecodeString(encodedString)
	originalBytes, err := aesDecrypt(decodedBytes, ivString, key)
	if err != nil {
		log.Println(err)
		return false
	}

	plaintextString := string(originalBytes)

	epoch, encodedKey, err := extractEpochAndEncodedKey(plaintextString)
	if err != nil {
		log.Println(err)
		return false
	}

	// Check timestamp validity
	currentTime := time.Now().Unix()
	if currentTime-epoch > tokenLifetime || epoch > currentTime {
		log.Println("Invalid timestamp:", epoch)
		return false
	}

	return encodedKey == key
}
