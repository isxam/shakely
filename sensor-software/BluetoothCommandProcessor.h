/*****************************************************************************/
// BluetoothCommandProcessor class
/*******************************************************************************/

#ifndef __BLUETOOTH_COMMAND_PROCESSOR_H__
#define __BLUETOOTH_COMMAND_PROCESSOR_H__

#include "BluetoothCommand.h"
#include <SoftwareSerial.h>
#include <Arduino.h>

class BluetoothCommandProcessor
{
    public:
        BluetoothCommandProcessor(Stream* deviceSerial, BluetoothCommand **commands);
        void process();
    private:
        char terminateString = '\n';
        char delimiterString = ',';
        Stream* deviceSerial;
        BluetoothCommand **commands;
};

#endif
