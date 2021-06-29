class MLPlay:
    def __init__(self, player):
        self.player_no = player[6]
        self.r_sensor_value = 0
        self.l_sensor_value = 0
        self.f_sensor_value = 0
        self.control_list = [{"left_PWM" : 0, "right_PWM" : 0}]
        print("Initial ml script")

    def update(self, scene_info: dict):
        """
        Generate the command according to the received scene information
        """
        self.r_sensor_value = scene_info["R_sensor"]
        self.l_sensor_value = scene_info["L_sensor"]
        self.f_sensor_value = scene_info["F_sensor"]
        if self.f_sensor_value >30:
            self.control_list[0]["left_PWM"] = 50
            self.control_list[0]["right_PWM"] = 50
        if self.r_sensor_value >30:
            self.control_list[0]["left_PWM"] = 100
        if self.l_sensor_value >30:
            self.control_list[0]["right_PWM"] = 100
        if self.f_sensor_value <10:
            self.control_list[0]["left_PWM"] = -50
            self.control_list[0]["right_PWM"] = -50
        return self.control_list

    def reset(self):
        """
        Reset the status
        """
        print("reset ml script")
        pass
