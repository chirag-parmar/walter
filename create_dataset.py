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
    filling = False

    #initialize keyboard recording
    keyboard = Keyboard()

    #start dataset creation loop
    while True:

        datapoint = {"index": datapoint_index, "val": 0, "touch": False, "level": water_level, "filling": filling}

        pressed = False

        if keyboard.key_pressed():
            key = keyboard.read_key()
            pressed = True

        #exit if "x" key is pressed
        if pressed and key == "q":
            print("QUIT")
            with open("datasets/" + dataset_name + ".json", 'w+') as fout:
                json.dump(dataset, fout)
            break

        #if "t" key is pressed then mark the datapoint as a touch datapoint
        if pressed and key == "e":
            datapoint["touch"] = True

        #if "w" key is pressed increment water level
        if pressed and key == "w":
            water_level += 1
            print("Level: {}".format(water_level))

        #if "s" key is pressed decrement water level
        if pressed and key == "s":
            water_level -= 1
            print("Level: {}".format(water_level))

        #if "s" key is pressed decrement water level
        if pressed and key == "a":
            filling = not filling
            print("Filling: {}".format(filling))

        #record the sensor value for this datapoint
        datapoint["val"] = myWalter.read()

        #append datapoint into the dataset
        dataset.append(datapoint)

        #increment index for the next datapoint
        datapoint_index += 1

else:
    print("Couldn't find walter")