from walter import Walter

myWalter = Walter("1A86:7523")

if myWalter.discover():
    #connect to walter
    myWalter.connect()

    while True:
        print(myWalter.read())