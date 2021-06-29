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
    def __init__(self, side):
        self.ball_served = False
        self.side = side
        self.action = []
        self.ball_position = []
    def update(self, scene_info):
        if self.side == '1P':
            if scene_info['status'] != "GAME_ALIVE":
                with open(os.path.join(os.path.dirname(__file__), 'feature.pickle'), 'wb') as f:
                    pickle.dump(self.ball_position, f)
                with open(os.path.join(os.path.dirname(__file__), 'target.pickle'), 'wb') as f:
                    pickle.dump(self.action, f)
                return "RESET"
            if not self.ball_served:
                self.ball_served = True
                return "SERVE_TO_LEFT"
            else:
                if _KEYBOARD_ON_PRESSED["Key.left"]:
                    self.ball_position.append([scene_info['ball_speed'][0], scene_info['ball_speed'][1]])
                    self.action.append(1)
                    return "MOVE_LEFT"
                elif _KEYBOARD_ON_PRESSED["Key.right"]:
                    self.ball_position.append([scene_info['ball_speed'][0], scene_info['ball_speed'][1]])
                    self.action.append(0)
                    return "MOVE_RIGHT"
        else:
            if scene_info['status'] != "GAME_ALIVE":
                return "RESET"
            if not self.ball_served:
                self.ball_served = True
                return "SERVE_TO_LEFT"
            else:
                if (_KEYBOARD_ON_PRESSED["'A'"] or _KEYBOARD_ON_PRESSED["'a'"]):
                    return "MOVE_LEFT"
                elif (_KEYBOARD_ON_PRESSED["'D'"] or _KEYBOARD_ON_PRESSED["'d'"]):
                    return "MOVE_RIGHT"
    def reset(self):
        self.ball_served = False