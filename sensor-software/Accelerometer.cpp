/*****************************************************************************/
// Accelerometer class implementation
/*******************************************************************************/

#include "Accelerometer.h"

Accelerometer::Accelerometer()
{
    deviceInstance = new Adafruit_ADXL345_Unified(10001);
}

void Accelerometer::init()
{
    deviceInstance->begin();
    deviceInstance->setRange(ADXL345_RANGE_16_G);
    deviceInstance->setDataRate(ADXL345_DATARATE_800_HZ);
}

Acceleration Accelerometer::getAcceleration()
{
    sensors_event_t event; 
    deviceInstance->getEvent(&event);

    Acceleration acc(event.acceleration.x, event.acceleration.y, event.acceleration.z);

    return acc;
}
