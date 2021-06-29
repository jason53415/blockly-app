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
    def __init__(self):
        self.ball_served = False
        self.actions = []
        self.positions = []
    def update(self, scene_info):
        if scene_info['status'] == "GAME_PASS" or scene_info['status'] == "GAME_OVER":
            with open(os.path.join(os.path.dirname(__file__), 'target.pickle'), 'wb') as f:
                pickle.dump(self.actions, f)
            with open(os.path.join(os.path.dirname(__file__), 'feature.pickle'), 'wb') as f:
                pickle.dump(self.positions, f)
            return "RESET"
        if not self.ball_served:
            if (_KEYBOARD_ON_PRESSED["'A'"] or _KEYBOARD_ON_PRESSED["'a'"]):
                self.ball_served = True
                return "SERVE_TO_LEFT"
            elif (_KEYBOARD_ON_PRESSED["'D'"] or _KEYBOARD_ON_PRESSED["'d'"]):
                self.ball_served = True
                return "SERVE_TO_RIGHT"
        else:
            if _KEYBOARD_ON_PRESSED["Key.left"]:
                self.ball_served = True
                self.positions.append([scene_info['ball'][0], scene_info['ball'][1]])
                self.actions.append(1)
                return "MOVE_LEFT"
            elif _KEYBOARD_ON_PRESSED["Key.right"]:
                self.ball_served = True
                self.positions.append([scene_info['ball'][0], scene_info['ball'][1]])
                self.actions.append(0)
                return "MOVE_RIGHT"
    def reset(self):
        self.ball_served = False