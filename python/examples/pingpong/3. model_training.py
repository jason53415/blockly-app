import pickle
import os
from sklearn import tree

with open(os.path.join(os.path.dirname(__file__), 'feature.pickle'), 'rb') as f:
    ball_position = pickle.load(f)
with open(os.path.join(os.path.dirname(__file__), 'target.pickle'), 'rb') as f:
    action = pickle.load(f)
model = tree.DecisionTreeRegressor(max_depth=5, min_samples_split=2)
model.fit(ball_position, action)
with open(os.path.join(os.path.dirname(__file__), 'model.pickle'), 'wb') as f:
    pickle.dump(model, f)