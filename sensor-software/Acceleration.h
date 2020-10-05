/*****************************************************************************/
// Acceleration class
/*******************************************************************************/

#ifndef __ACCELERATION_H__
#define __ACCELERATION_H__

class Acceleration
{
    private:
        float x;
        float y;
        float z;
    public:
        Acceleration(float x, float y, float z);
        float getX();
        float getY();
        float getZ();
};

#endif
