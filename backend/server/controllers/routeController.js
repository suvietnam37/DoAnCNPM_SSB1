const RouteModel = require('../../models/Route');
const mongoose = require('mongoose');

// Kiểm tra model có phải là Mongoose hay không
function isMongooseModel(model) {
  return model && typeof model.find === 'function' && typeof model.findById === 'function';
}

// Hỗ trợ khi dùng dữ liệu in-memory (hardcode)
const inMemory = {
  getStore() {
    if (!RouteModel) return null;
    if (Array.isArray(RouteModel)) return { routes: RouteModel };
    if (Array.isArray(RouteModel.routes)) return RouteModel;
    return null;
  },
  nextId(routes) {
    const max = routes.reduce((m, r) => Math.max(m, r.route_id || r.id || 0), 0);
    return max + 1;
  }
};

// [GET] /api/routes
exports.getAllRoutes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    if (isMongooseModel(RouteModel)) {
      const total = await RouteModel.countDocuments();
      const data = await RouteModel.find().skip(skip).limit(limit).lean();
      return res.json({ meta: { page, limit, total }, data });
    }

    const store = inMemory.getStore();
    if (store) {
      const total = store.routes.length;
      const data = store.routes.slice(skip, skip + limit);
      return res.json({ meta: { page, limit, total }, data });
    }

    res.status(500).json({ message: 'Route model not found' });
  } catch (err) {
    console.error('getAllRoutes error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// [GET] /api/routes/:id
exports.getRouteById = async (req, res) => {
  try {
    const id = req.params.id;

    if (isMongooseModel(RouteModel)) {
      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: 'Invalid route ID' });

      const route = await RouteModel.findById(id).lean();
      if (!route) return res.status(404).json({ message: 'Route not found' });
      return res.json(route);
    }

    const store = inMemory.getStore();
    if (store) {
      const route = store.routes.find(r => String(r.route_id || r.id) === String(id));
      if (!route) return res.status(404).json({ message: 'Route not found' });
      return res.json(route);
    }

    res.status(500).json({ message: 'Route model not found' });
  } catch (err) {
    console.error('getRouteById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// [POST] /api/routes
exports.createRoute = async (req, res) => {
  try {
    const { route_name, start_point, end_point, path_points, estimated_time } = req.body;
    if (!route_name || !start_point || !end_point) {
      return res.status(400).json({ message: 'route_name, start_point, end_point are required' });
    }

    if (isMongooseModel(RouteModel)) {
      const newRoute = await RouteModel.create({
        route_name,
        start_point,
        end_point,
        path_points: path_points || [],
        estimated_time: estimated_time || null
      });
      return res.status(201).json(newRoute);
    }

    const store = inMemory.getStore();
    if (store) {
      const newId = inMemory.nextId(store.routes);
      const newRoute = {
        route_id: newId,
        route_name,
        start_point,
        end_point,
        path_points: path_points || [],
        estimated_time: estimated_time || null
      };
      store.routes.push(newRoute);
      return res.status(201).json(newRoute);
    }

    res.status(500).json({ message: 'Route model not found' });
  } catch (err) {
    console.error('createRoute error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// [PUT] /api/routes/:id
exports.updateRoute = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    if (isMongooseModel(RouteModel)) {
      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: 'Invalid route ID' });

      const updated = await RouteModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
      if (!updated) return res.status(404).json({ message: 'Route not found' });
      return res.json(updated);
    }

    const store = inMemory.getStore();
    if (store) {
      const idx = store.routes.findIndex(r => String(r.route_id || r.id) === String(id));
      if (idx === -1) return res.status(404).json({ message: 'Route not found' });
      store.routes[idx] = { ...store.routes[idx], ...updates };
      return res.json(store.routes[idx]);
    }

    res.status(500).json({ message: 'Route model not found' });
  } catch (err) {
    console.error('updateRoute error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// [DELETE] /api/routes/:id
exports.deleteRoute = async (req, res) => {
  try {
    const id = req.params.id;

    if (isMongooseModel(RouteModel)) {
      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: 'Invalid route ID' });

      const deleted = await RouteModel.findByIdAndDelete(id).lean();
      if (!deleted) return res.status(404).json({ message: 'Route not found' });
      return res.json({ message: 'Route deleted successfully' });
    }

    const store = inMemory.getStore();
    if (store) {
      const idx = store.routes.findIndex(r => String(r.route_id || r.id) === String(id));
      if (idx === -1) return res.status(404).json({ message: 'Route not found' });
      store.routes.splice(idx, 1);
      return res.json({ message: 'Route deleted successfully' });
    }

    res.status(500).json({ message: 'Route model not found' });
  } catch (err) {
    console.error('deleteRoute error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// [GET] /api/routes/search?q=...
exports.searchRoutes = async (req, res) => {
  try {
    const q = (req.query.q || '').trim().toLowerCase();
    if (!q) return res.status(400).json({ message: 'Missing query parameter q' });

    if (isMongooseModel(RouteModel)) {
      const regex = new RegExp(q, 'i');
      const routes = await RouteModel.find({
        $or: [{ route_name: regex }, { start_point: regex }, { end_point: regex }]
      }).lean();
      return res.json(routes);
    }

    const store = inMemory.getStore();
    if (store) {
      const results = store.routes.filter(r =>
        (r.route_name && r.route_name.toLowerCase().includes(q)) ||
        (r.start_point && r.start_point.toLowerCase().includes(q)) ||
        (r.end_point && r.end_point.toLowerCase().includes(q))
      );
      return res.json(results);
    }

    res.status(500).json({ message: 'Route model not found' });
  } catch (err) {
    console.error('searchRoutes error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
