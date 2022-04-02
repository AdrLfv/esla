from core.application import BaseApplication
import time

class Application(BaseApplication):
    """Esla"""

    def __init__(self, name, hal, server, manager):
        super().__init__(name, hal, server, manager)
        self.requires["pose_to_mirror"] = ["mirrored_data"]
        self.count = 0
        self.total = 0

    def listener(self, source, event, data):
        super().listener(source, event, data)
        
        if source == "pose_to_mirror" and event == "mirrored_data" and data is not None:
            self.data = data
            # time_received_frame = time.time()
            # time_sent_frame = self.data["time_sent_frame"]
            # if(self.count <1000):
            #     self.total += time_received_frame - time_sent_frame
            #     self.count += 1
            #     print(time_received_frame - time_sent_frame)
            # elif(self.count == 1000):
            #     print("Average time:", time_received_frame - time_sent_frame)
            #     self.count += 1

            self.server.send_data(self.name, self.data)
            self.data = {
                # "left_hand_pose": self.data["left_hand_pose"],
                # "right_hand_pose": self.data["right_hand_pose"],
                "body_pose": self.data["body_pose"]
            }
            
