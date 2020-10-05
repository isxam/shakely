/*****************************************************************************/
// BluetoothPingCommand class implementation
/*******************************************************************************/

#include "BluetoothPingCommand.h"

BluetoothPingCommand::BluetoothPingCommand(Stream* deviceStream) : BluetoothCommand()
{
    mDeviceStream = deviceStream;
}

bool BluetoothPingCommand::isApplicable(char *code)
{
    char commandCode[] = "p";

    return strcmp(commandCode, code) == 0;
}

void BluetoothPingCommand::execute(char *code, char* payload)
{
    mDeviceStream->println(String("p") + "," + String(payload) + "," + millis());
}
