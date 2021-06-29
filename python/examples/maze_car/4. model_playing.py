import pickle
import os

class MLPlay:
    def __init__(self, player):
        self.f_sensor_value = 0
        self.r_sensor_value = 0
        self.l_sensor_value = 0
        self.left_PWM = 0
        self.right_PWM = 0
        self.sensor_values = []
        self.PWMs = []
        with open(os.path.join(os.path.dirname(__file__), 'model.pickle'), 'rb') as f:
            self.model = pickle.load(f)
    def update(self, scene_info):
        self.f_sensor_value = scene_info['F_sensor']
        self.l_sensor_value = scene_info['L_sensor']
        self.r_sensor_value = scene_info['R_sensor']
        self.sensor_values = [[self.f_sensor_value, self.l_sensor_value, self.r_sensor_value]]
        self.PWMs = self.model.predict(self.sensor_values)

        self.left_PWM = self.PWMs[0][0]
        self.right_PWM = self.PWMs[0][1]
        return [{'left_PWM': self.left_PWM, 'right_PWM': self.right_PWM}]
    def reset(self):
        pass