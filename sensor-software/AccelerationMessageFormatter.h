/*****************************************************************************/
// Acceleration message formatter class
/*******************************************************************************/

#ifndef __ACCELERATION_MESSAGE_FORMATTER_H__
#define __ACCELERATION_MESSAGE_FORMATTER_H__

#include <Arduino.h>

class AccelerationMessageFormatter
{
    public:
        AccelerationMessageFormatter();
        String format(unsigned long time, float acceleration, float speed);
};

#endif
