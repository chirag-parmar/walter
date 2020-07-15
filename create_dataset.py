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
    datapoint_index = 0

    #start dataset creation loop
    while True:

        user_choice = input("Enter number of datapoints to collect(q/Q - quit): ")
        num_of_datapoints = 0

        if user_choice == 'q' or user_choice == 'Q':
            with open("datasets/" + dataset_name + ".json", 'w+') as fout:
                json.dump(dataset, fout)
            break
        elif user_choice.isnumeric():
            num_of_datapoints = int(user_choice)

        water_level = int(input("Enter the level of water: "))

        print("Collecting data points....")

        for i in range(num_of_datapoints):
            datapoint = {"index": datapoint_index, "val": 0, "level": water_level}

            #record the sensor value for this datapoint
            datapoint["val"] = myWalter.read()

            #append datapoint into the dataset
            dataset.append(datapoint)

            #increment index for the next datapoint
            datapoint_index += 1

else:
    print("Couldn't find walter")