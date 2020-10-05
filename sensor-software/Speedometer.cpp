/*****************************************************************************/
// Speedometer class implementation
/*******************************************************************************/

#include "Speedometer.h"
#include <HardwareSerial.h>

const int ZERO_SPEED_TIME_LIMIT = 5000;
const int NOIZE_TIME_LIMIT = 100;
const float MATH_PI = 3.14;

Speedometer::Speedometer(float wheelDiameter, int sensorsCount)
{
    segmentLength = (wheelDiameter * MATH_PI) / sensorsCount;
}

float Speedometer::getSpeed(unsigned long time)
{
    if (time - lastTrackedAt > ZERO_SPEED_TIME_LIMIT || lastDt == 0) {
        return 0.0;
    }

    return segmentLength / (lastDt / 1000.0);
}

void Speedometer::track(unsigned long time)
{
    if (time - lastTrackedAt < NOIZE_TIME_LIMIT) {
        return;
    }

    lastDt = time - lastTrackedAt;
    lastTrackedAt = time;
}
