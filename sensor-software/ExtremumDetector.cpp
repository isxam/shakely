/*****************************************************************************/
// ExtremumDetector class implementation
/*******************************************************************************/

#include "ExtremumDetector.h"

const float PRECISION = 5.0;

ExtremumDetector::ExtremumDetector()
{

}

bool ExtremumDetector::push(float value, unsigned long time)
{
    int sign = value == 0 ? 0 : value / abs(value);
    bool isExtremumFound = sign != trend && !isNoiseValue(tmpExtremumValue);

    if (isExtremumFound) {
        storeExtremum(time);
    }

    tmpDataCount++;
    trend = sign;

    if (abs(value) > abs(tmpExtremumValue)) {
        tmpExtremumValue = value;
        tmpExtremumTime = time;
    }

    return isExtremumFound;
}

void ExtremumDetector::purge(unsigned long time)
{
    storeExtremum(time);
}

float ExtremumDetector::getLastExtremumValue()
{
    return lastExtremumValue;
}

unsigned long ExtremumDetector::getLastExtremumTime()
{
    return lastExtremumTime;
}

int ExtremumDetector::getLastDataCount()
{
    return lastDataCount;
}

bool ExtremumDetector::isNoiseValue(float value)
{
    return value < PRECISION && value > PRECISION * -1;
}

float ExtremumDetector::abs(float value)
{
    return value > 0 ? value : value * -1;
}

void ExtremumDetector::storeExtremum(unsigned long time)
{
    lastExtremumValue = tmpExtremumValue;
    lastExtremumTime = tmpExtremumTime;
    lastDataCount = tmpDataCount;

    tmpExtremumValue = 0;
    tmpExtremumTime = time;
    tmpDataCount = 0;
}
