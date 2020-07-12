from keyboard import Keyboard
from walter import Walter
import json

myWalter = Walter("1A86:7523")

if myWalter.discover():
    #connect to walter
    myWalter.connect()

    #initialize variables
    dataset = []
    dataset_name = input ("Enter dataset name: ")
    water_level = int(input("Enter initial water level: "))
    datapoint_index = 0

    #initialize keyboard recording
    keyboard = Keyboard()

    #start dataset creation loop
    while True:
        datapoint = {"index": datapoint_index, "val": 0, "touch": False, "level": water_level}

        #exit if "x" key is pressed
        if keyboard.key_pressed() and keyboard.read_key() == "q":
            print("QUIT")
            with open("datasets/" + dataset_name + ".json", 'w+') as fout:
                json.dump(dataset, fout)
            break

        #if "t" key is pressed then mark the datapoint as a touch datapoint
        if keyboard.key_pressed() and keyboard.read_key() == "e":
            datapoint["touch"] = True

        #if "w" key is pressed
        #1. Halt recording
        #2. increment water level for subsequent datapoints
        #3. wait for any keypress
        if keyboard.key_pressed() and keyboard.read_key() == "w":
            water_level += 1

            while not keyboard.key_pressed():
                continue

        #if "s" key is pressed
        #1. Halt recording
        #2. increment water level for subsequent datapoints
        #3. wait for any keypress
        if keyboard.key_pressed() and keyboard.read_key() == "s":
            water_level -= 1

            while not keyboard.key_pressed():
                continue

        #record the sensor value for this datapoint
        datapoint["val"] = myWalter.read()

        #append datapoint into the dataset
        dataset.append(datapoint)

        #increment index for the next datapoint
        datapoint_index += 1

else:
    print("Couldn't find walter")