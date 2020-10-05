#include <SoftwareSerial.h>
#include <Wire.h>
#include "Accelerometer.h"
#include "Acceleration.h"
#include "AccelerationMessageFormatter.h"
#include "Speedometer.h"
#include "BluetoothCommand.h"
#include "BluetoothPingCommand.h"
#include "BluetoothCommandProcessor.h"
#include "ExtremumDetector.h"

/**
* BlueTooth settings
*/
#define BT_RX_PIN 4
#define BT_TX_PIN 6
#define BT_SPEED 57600

/**
* Speedometer settings
*/
#define SPEEDOMETER_WHEEL_DIAMETER 0.73
#define SPEEDOMETER_SENSOR_COUNT 1
#define SPEEDOMETER_PIN 2

/**
* Accelerometer settings
*/
#define ACCELEROMETER_DEVIATION 10.2

/**
* General settings
*/
#define SENSOR_RATE_MIN_LIMIT 1000
#define LOOP_DELAY 1

/**
* Initialize services
*/
SoftwareSerial hc06(BT_RX_PIN, BT_TX_PIN);
Accelerometer accelerometer;
AccelerationMessageFormatter formatter;
Speedometer speedometer(SPEEDOMETER_WHEEL_DIAMETER, SPEEDOMETER_SENSOR_COUNT);
ExtremumDetector extremumDetector;

BluetoothPingCommand pingCommand(&hc06);
BluetoothCommand* commands[] = {&pingCommand};
BluetoothCommandProcessor btCommandsProcessor(&hc06, commands);

unsigned long lastSendTime = 0;

void setup(){
    // initialize bluetooth device
    hc06.begin(BT_SPEED);

    // initialize accelerometer sensor
    accelerometer.init();

    // initialize speedometer listening
    attachInterrupt(0, onSpeedSensorChanged, RISING);
    pinMode(SPEEDOMETER_PIN, INPUT);
}

void loop(){
    unsigned long time = millis();
    float accelerationNormalized = 0.0;
    float speed = 0.0;
    bool isExtremumFound = false;

    // process input commands
    btCommandsProcessor.process();

    // retrieve sensors data
    Acceleration acc = accelerometer.getAcceleration();
    accelerationNormalized = acc.getZ() - ACCELEROMETER_DEVIATION;
    speed = speedometer.getSpeed(time);

    // add acceleration to extremum detector
    isExtremumFound = extremumDetector.push(accelerationNormalized, time);

    // force data sending if limit is expired
    if (!isExtremumFound && time - lastSendTime > SENSOR_RATE_MIN_LIMIT) {
        extremumDetector.purge(time);
        isExtremumFound = true;
    }

    if (isExtremumFound) {
        sendSensorData(&hc06, &extremumDetector, speed);
        lastSendTime = time;
    }

    delay(LOOP_DELAY);
}

void onSpeedSensorChanged() {
    speedometer.track(millis());
}

void sendSensorData(SoftwareSerial* mDevice, ExtremumDetector* mExtremumDetector, float speed)
{
    String message = formatter.format(
        mExtremumDetector->getLastExtremumTime(),
        mExtremumDetector->getLastExtremumValue(),
        3.6 * speed
    );
    mDevice->println(message);  
}
