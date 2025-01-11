const db = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { GraphQLJSON } = require("graphql-type-json");
const resolvers = {
  JSON: GraphQLJSON,

  Query: {
    villages: async () => {
      const [rows] = await db.query('SELECT * FROM villages');
      return rows;
    },
    users: async () => {
      const [rows] = await db.query("SELECT * FROM users");
      return rows.map(user => ({
        ...user,
        profile_image: user.profile_image // نقوم بإرجاع اسم الصورة فقط
      }));
    },
    
    user: async (_, { id }) => {
      if (!id) {
        throw new Error("User ID is missing");
      }
    
      const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
      if (rows.length === 0) {
        throw new Error("User not found");
      }
    
      const user = rows[0];
      return {
        id: user.id,
        username: user.username,
        profile_image: user.profile_image, // تأكد من أن هذه القيمة موجودة
        email: user.email,
      };
    },
    village: async (_, { id }) => {
      const [rows] = await db.query('SELECT * FROM villages WHERE id = ?', [id]);
      if (rows.length === 0) {
        throw new Error(`Village with ID ${id} not found`);
      }
      return rows[0];
    },
    
    getGallery: async () => {
      const [rows] = await db.query('SELECT * FROM gallery');
      return rows;
    },
    currentUser: async (_, __, { token }) => {
      if (!token) throw new Error('Not authenticated');
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [user] = await db.query('SELECT id, username, full_name, role FROM users WHERE id = ?', [decoded.id]);
        return user;
      } catch (err) {
        throw new Error('Invalid token');
      }
    },
  },

  Mutation: {
    addVillage: async (_, args) => {
      try {
        const sql = `INSERT INTO villages (name, region, land_area, latitude, longitude, image, tags) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(sql, [
          args.name,
          args.region,
          args.land_area,
          args.latitude,
          args.longitude,
          args.image || null,
          Array.isArray(args.tags) ? JSON.stringify(args.tags) : null,
        ]);
        return { id: result.insertId, ...args, tags: args.tags };
      } catch (err) {
        console.error("Error in addVillage:", err);
        throw new Error("Failed to add village");
      }
    },
    
    

    addDemographicData: async (_, { villageId, population, population_distribution, gender_ratios, population_growth_rate }) => {
      console.log("addDemographicData resolver called");
      try {
        const sql = `
          UPDATE villages 
          SET 
            population = ?, 
            population_distribution = ?, 
            gender_ratios = ?, 
            population_growth_rate = ? 
          WHERE id = ?
        `;
        await db.query(sql, [
          population,
          population_distribution, // النص كما هو
          gender_ratios,           // النص كما هو
          population_growth_rate,
          villageId,
        ]);
    
        const [updatedVillage] = await db.query('SELECT * FROM villages WHERE id = ?', [villageId]);
        console.log("Updated village:", updatedVillage[0]);
        return updatedVillage[0];
      } catch (error) {
        console.error("Error in addDemographicData:", error);
        throw new Error("Failed to add demographic data");
      }
    },
    
    updateUser: async (_, { id, username, email, password, profile_image }, { UserModel }) => {
      try {
        // العثور على المستخدم في قاعدة البيانات
        const user = await UserModel.findById(id);
        if (!user) {
          throw new Error('User not found');
        }
    
        // تحديث البيانات بناءً على القيم المدخلة
        user.username = username || user.username;
        user.email = email || user.email;
        user.password = password || user.password;
        user.profile_image = profile_image || user.profile_image;
    
        // حفظ التحديثات في قاعدة البيانات
        await user.save();
    
        return user; // إرجاع المستخدم المُحدث
      } catch (error) {
        throw new Error(error.message);
      }
    },

    updateVillage: async (_, args) => {
      const sql = `UPDATE villages SET name = ?, region = ?, land_area = ?, latitude = ?, longitude = ?, image = ?, tags = ?, population = ?, population_distribution = ?, gender_ratios = ?, population_growth_rate = ? WHERE id = ?`;
      await db.query(sql, [
        args.name,
        args.region,
        args.land_area,
        args.latitude,
        args.longitude,
        args.image,
        JSON.stringify(args.tags),
        args.population,
        JSON.stringify(args.population_distribution),
        JSON.stringify(args.gender_ratios),
        args.population_growth_rate,
        args.id,
      ]);
      return args;
    },

    deleteVillage: async (_, { id }) => {
      await db.query('DELETE FROM villages WHERE id = ?', [id]);
      return true;
    },

    signUp: async (_, { username, password, full_name, role, profileImage }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO users (username, password, full_name, role, profileImage) VALUES (?, ?, ?, ?, ?)';
      await db.query(sql, [username, hashedPassword, full_name, role, profileImage || null]);
      const token = jwt.sign({ username, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { token, role, username };
    },
    login: async (_, { username, password }) => {
      const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      if (rows.length === 0) {
        throw new Error('User not found');
      }

      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid username or password');
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { token, role: user.role, username: user.username };
    },
  
    
    

    logout: async (_, __, { token }) => {
      if (!token) throw new Error('Not authenticated');
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await db.query('UPDATE users SET is_logged_in = 0 WHERE id = ?', [decoded.id]);
        return { message: 'Logged out successfully' };
      } catch (err) {
        throw new Error('Invalid token');
      }
    },

    addImage: async (_, { imgBase64, imgText }) => {
      const sql = 'INSERT INTO gallery (imgBase64, imgText) VALUES (?, ?)';
      const [result] = await db.query(sql, [imgBase64, imgText]);
      return {
        id: result.insertId,
        imgBase64,
        imgText,
        createdAt: new Date().toISOString(),
      };
    },
  },
};

module.exports = resolvers;
