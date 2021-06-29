import pickle
import os
from sklearn import neighbors

with open(os.path.join(os.path.dirname(__file__), 'feature.pickle'), 'rb') as f:
    sensor_values = pickle.load(f)
with open(os.path.join(os.path.dirname(__file__), 'target.pickle'), 'rb') as f:
    PWMs = pickle.load(f)
model = neighbors.KNeighborsRegressor(5, weights='uniform')
model.fit(sensor_values, PWMs)
with open(os.path.join(os.path.dirname(__file__), 'model.pickle'), 'wb') as f:
    pickle.dump(model, f)