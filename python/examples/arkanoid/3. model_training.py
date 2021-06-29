import pickle
import os
from sklearn import neighbors

with open(os.path.join(os.path.dirname(__file__), 'feature.pickle'), 'rb') as f:
    positions = pickle.load(f)
with open(os.path.join(os.path.dirname(__file__), 'target.pickle'), 'rb') as f:
    actions = pickle.load(f)
model = neighbors.KNeighborsRegressor(5, weights='uniform')
model.fit(positions, actions)
with open(os.path.join(os.path.dirname(__file__), 'model.pickle'), 'wb') as f:
    pickle.dump(model, f)