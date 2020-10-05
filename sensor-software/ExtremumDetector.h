/*****************************************************************************/
// ExtremumDetector class
/*******************************************************************************/

#ifndef __EXTREMUM_DETECTOR_H__
#define __EXTREMUM_DETECTOR_H__

class ExtremumDetector
{
    private:
        int trend = 0;
        float tmpExtremumValue = 0.0;
        unsigned long tmpExtremumTime = 0;
        int tmpDataCount = 0;

        float lastExtremumValue = 0.0;
        unsigned long lastExtremumTime = 0;
        int lastDataCount = 0;

        bool isNoiseValue(float value);
        float abs(float value);
        void storeExtremum(unsigned long time);
    public:
        ExtremumDetector();
        bool push(float value, unsigned long time);
        void purge(unsigned long time);
        float getLastExtremumValue();
        unsigned long getLastExtremumTime();
        int getLastDataCount();
};

#endif
