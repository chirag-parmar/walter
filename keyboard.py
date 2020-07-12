#Author: Artiom Peysakhovsky, https://gist.github.com/Artiomio

# from __future__ import print_function

import sys
import select
import tty
import termios
import atexit
import time

class Keyboard:
    def __init__(self):
        atexit.register(self.restore_settings)
        self.old_settings = termios.tcgetattr(sys.stdin)
        tty.setcbreak(sys.stdin.fileno())

    def key_pressed(self):
        return select.select([sys.stdin], [], [], 0) == ([sys.stdin], [], [])

    def read_key(self):
        return sys.stdin.read(1)

    def restore_settings(self):
        termios.tcsetattr(sys.stdin, termios.TCSADRAIN, self.old_settings)
