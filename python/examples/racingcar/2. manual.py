from pynput import keyboard
from collections import defaultdict
import pickle
import os

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
        self.player = player
        self.other_cars_position = []
        self.player_car_position = []
        self.action = []
    def update(self, scene_info):
        if scene_info['status'] == "RUNNING":
            if _KEYBOARD_ON_PRESSED["Key.right"]:
                self.player_car_position.append([scene_info['x'], scene_info['y']])
                self.action.append(1)
                return ['SPEED']
            elif _KEYBOARD_ON_PRESSED["Key.left"]:
                self.player_car_position.append([scene_info['x'], scene_info['y']])
                self.action.append(2)
                return ['BRAKE']
            elif _KEYBOARD_ON_PRESSED["Key.up"]:
                self.player_car_position.append([scene_info['x'], scene_info['y']])
                self.action.append(3)
                return ['MOVE_LEFT']
            elif _KEYBOARD_ON_PRESSED["Key.down"]:
                self.player_car_position.append([scene_info['x'], scene_info['y']])
                self.action.append(4)
                return ['MOVE_RIGHT']
        elif scene_info['status'] == "END":
            with open(os.path.join(os.path.dirname(__file__), 'feature.pickle'), 'wb') as f:
                pickle.dump(self.player_car_position, f)
            with open(os.path.join(os.path.dirname(__file__), 'target.pickle'), 'wb') as f:
                pickle.dump(self.action, f)
    def reset(self):
        pass