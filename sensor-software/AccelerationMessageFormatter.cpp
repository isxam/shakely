/*****************************************************************************/
// Acceleration class implementation
/*******************************************************************************/

#include "AccelerationMessageFormatter.h"

AccelerationMessageFormatter::AccelerationMessageFormatter()
{

}

String AccelerationMessageFormatter::format(unsigned long time, float acceleration, float speed)
{
    return String("s") + "," + time + ","
        + (int)(acceleration) + ","
        + (int)(speed);
}
