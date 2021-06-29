import pickle
import os
from sklearn import neighbors

with open(os.path.join(os.path.dirname(__file__), 'feature.pickle'), 'rb') as f:
    player_car_position = pickle.load(f)
with open(os.path.join(os.path.dirname(__file__), 'target.pickle'), 'rb') as f:
    action = pickle.load(f)
model = neighbors.KNeighborsRegressor(5, weights='uniform')
model.fit(player_car_position, action)
with open(os.path.join(os.path.dirname(__file__), 'model.pickle'), 'wb') as f:
    pickle.dump(model, f)