/*****************************************************************************/
// BluetoothCommandProcessor class implementation
/*******************************************************************************/

#include "BluetoothCommandProcessor.h"

const unsigned int MAX_ARGUMENTS_COUNT = 2;
const unsigned int MAX_MESSAGE_SIZE = 50;

BluetoothCommandProcessor::BluetoothCommandProcessor(Stream* deviceSerial, BluetoothCommand **commands)
    : deviceSerial{ deviceSerial }, commands{ commands }
{

}

void BluetoothCommandProcessor::process()
{
    if (!deviceSerial->available()) {
        return;
    }

    char message[MAX_MESSAGE_SIZE];

    deviceSerial->readBytesUntil(terminateString, message, MAX_MESSAGE_SIZE);

    String messageString = String(message);
    messageString = messageString.substring(0, messageString.length());

    int to = messageString.indexOf(delimiterString);
    String commandCode = messageString.substring(0, to);
    char commandCodeChar[20];
    commandCode.toCharArray(commandCodeChar, 20);

    String payload = messageString.substring(to + 1);
    char payloadChar[20];
    payload.toCharArray(payloadChar, 20);

    int commandsCount = sizeof(commands) / sizeof(BluetoothCommand*);
    for (int i = 0; i < commandsCount; i++) {
        if (commands[i]->isApplicable(commandCodeChar)) {
            commands[i]->execute(commandCodeChar, payloadChar);
        }
    }
}
