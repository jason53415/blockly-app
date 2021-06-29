import pickle
import os
from pynput import keyboard
from collections import defaultdict

_KEYBOARD_ON_PRESSED = None

def on_press(key):
    _KEYBOARD_ON_PRESSED[str(key)] = True

def on_release(key):
    _KEYBOARD_ON_PRESSED[str(key)] = False

_KEYBOARD_ON_PRESSED = defaultdict(bool)
listener = keyboard.Listener(
    on_press=on_press,
    on_release=on_release)
listener.start()


class MLPlay:
    def __init__(self, player):
        self.f_sensor_value = 0
        self.r_sensor_value = 0
        self.l_sensor_value = 0
        self.left_PWM = 0
        self.right_PWM = 0
        self.feature = []
        self.target = []
    def update(self, scene_info):
        if scene_info['status'] != "GAME_PASS":
            with open(os.path.join(os.path.dirname(__file__), 'feature.pickle'), 'wb') as f:
                pickle.dump(self.feature, f)
            with open(os.path.join(os.path.dirname(__file__), 'target.pickle'), 'wb') as f:
                pickle.dump(self.target, f)
        elif _KEYBOARD_ON_PRESSED["Key.up"]:
            self.left_PWM = 150
            self.right_PWM = 150
        elif _KEYBOARD_ON_PRESSED["Key.right"]:
            self.left_PWM = 100
            self.right_PWM = -100
        elif _KEYBOARD_ON_PRESSED["Key.left"]:
            self.left_PWM = -100
            self.right_PWM = 100
        elif _KEYBOARD_ON_PRESSED["Key.down"]:
            self.left_PWM = -150
            self.right_PWM = -150
        else:
            self.left_PWM = 0
            self.right_PWM = 0
        self.feature.append([scene_info['F_sensor'], scene_info['L_sensor'], scene_info['R_sensor']])
        self.target.append([self.left_PWM, self.right_PWM])
        return [{'left_PWM': self.left_PWM, 'right_PWM': self.right_PWM}]
    def reset(self):
        pass