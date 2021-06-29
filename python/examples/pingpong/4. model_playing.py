import pickle
import os

class MLPlay:
    def __init__(self, side):
        self.ball_served = False
        self.side = side
        with open(os.path.join(os.path.dirname(__file__), 'model.pickle'), 'rb') as f:
            self.model = pickle.load(f)
    def update(self, scene_info):
        if scene_info['status'] != "GAME_ALIVE":
            return "RESET"
        if not self.ball_served:
            self.ball_served = True
            return "SERVE_TO_LEFT"
        else:
            self.action = self.model.predict([[scene_info['ball'][0], scene_info['ball'][1]]])
            if self.action == 1:
                return "MOVE_LEFT"
            else:
                return "SERVE_TO_RIGHT"
    def reset(self):
        self.ball_served = False