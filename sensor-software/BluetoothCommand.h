/*****************************************************************************/
// BluetoothCommand class
/*******************************************************************************/

#ifndef __BLUETOOTH_COMMAND_H__
#define __BLUETOOTH_COMMAND_H__

#include <Arduino.h>

class BluetoothCommand
{
    public:
        virtual bool isApplicable(char *code) = 0;
        virtual void execute(char *code, char* payload) = 0;
};

#endif
