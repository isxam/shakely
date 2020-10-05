/*****************************************************************************/
// Acceleration class implementation
/*******************************************************************************/

#include "Acceleration.h"

Acceleration::Acceleration(float ax, float ay, float az)
    : x{ ax }, y{ ay }, z{ az }
{

}

float Acceleration::getX()
{
    return x;
}

float Acceleration::getY()
{
    return y;
}

float Acceleration::getZ()
{
    return z;
}
