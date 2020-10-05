/*****************************************************************************/
// BluetoothPingCommand class
/*******************************************************************************/

#ifndef __BLUETOOTH_PING_COMMAND_H__
#define __BLUETOOTH_PING_COMMAND_H__

#include <Arduino.h>
#include "BluetoothCommand.h"

class BluetoothPingCommand: public BluetoothCommand
{
    private:
        Stream* mDeviceStream;
    public:
        BluetoothPingCommand(Stream* deviceStream);
        bool isApplicable(char* code);
        void execute(char *code, char* payload);
};

#endif
