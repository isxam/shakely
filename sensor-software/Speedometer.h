/*****************************************************************************/
// Speedometer class
/*******************************************************************************/

#ifndef __SPEEDOMETER_H__
#define __SPEEDOMETER_H__

class Speedometer
{
    private:
        float segmentLength;
        unsigned long lastTrackedAt = 0;
        unsigned long lastDt = 0;
    public:
        Speedometer(float wheelDiameter, int sensorsCount);
        float getSpeed(unsigned long time);
        void track(unsigned long time);
};

#endif
