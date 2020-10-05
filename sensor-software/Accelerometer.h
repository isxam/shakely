/*****************************************************************************/
// Accelerometer class
/*******************************************************************************/

#include <stdint.h>
#include "Adafruit_Sensor.h"
#include "Adafruit_ADXL345_U.h"
#include "Acceleration.h"

#ifndef __ACCELEROMETER_H__
#define __ACCELEROMETER_H__

class Accelerometer
{
    private:
        Adafruit_ADXL345_Unified *deviceInstance;
    public:
        Accelerometer();
        void init();
        Acceleration getAcceleration();
};

#endif
