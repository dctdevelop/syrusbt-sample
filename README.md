# Syrus Bluetooth Communication Example

## Requisites
An Android or iOS device with Bluetooth 4.1

### Android
if you use Android you will need install all Android depedencies to develop:
#### [Android Studio](https://developer.android.com/studio/install.html?hl=en-419)

### iOS
Otherwise if you use an iOS System like iPhone or iPad you will need to install XCode and enroll on the *Developers Program* on iTunes:
#### [App Developers Enrrollment](https://developer.apple.com/programs/enroll/)
#### [XCode](https://developer.apple.com/xcode/)


## Steps to test
1. install nodejs and npm
2. npm install -g cordova
3. cordova plugins add cordova-plugin-ble-central --save
4. cordova platforms add android|ios
5. cordova run android | ios


## Useful Documentation
#### [Cordova Getting Started](https://cordova.apache.org/#getstarted)
#### [Cordova plugin BLE](https://github.com/don/cordova-plugin-ble-central)
#### [Cordova Android Platform Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html)
#### [Cordova Ios Platform Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html)


## Tips
- It's important that your phone has Developers Options enabled
- Galaxy phones & Macbook users may have some trouble running the application on the phone, we followed the steps listed on [here](http://stackoverflow.com/questions/6469646/adb-devices-cant-find-my-phone) to solve this 
