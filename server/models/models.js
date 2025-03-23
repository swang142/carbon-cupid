import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const Fundee = sequelize.define('Fundee', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
  organizationName: { //provide
    type: DataTypes.STRING,
    allowNull: false
  },
  logo: { //provide
    type: DataTypes.STRING 
  },
  stage: { //provide
    type: DataTypes.ENUM('Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C')
  },
  industry: { //provide
    type: DataTypes.ARRAY(DataTypes.STRING) 
  },
  tagline: { //provide
    type: DataTypes.TEXT
  },
  fundingNeeded: { //provide
    type: DataTypes.INTEGER
  },
  location: {  //provide
    type: DataTypes.STRING
  },
  teamSize: { //provide
    type: DataTypes.RANGE(DataTypes.INTEGER)
  },
  revenue: { //provide
    type: DataTypes.RANGE(DataTypes.INTEGER)
  },
  foundingDate: { //provide
    type: DataTypes.DATE
  },
  carbon_credits_generated: { //provide
    type: DataTypes.INTEGER
  },
  compatability_score: { //provide
    type: DataTypes.INTEGER
  },
  impact_score: {
    type: DataTypes.INTEGER
  },
  mcdr_approach: { //provide  
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  description: {
    type: DataTypes.TEXT
  }
});

const mCDR_trials = sequelize.define('MCDR_trials', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    FundeesId: {
        type: DataTypes.UUID,
        references: {
            model: 'Fundees',
            key: 'id'
        }
    },
    organizationName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    all_cdr_methods: { //provide
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    goal_description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mrv_strategy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    monitoring_platforms: {
        type: DataTypes.ENUM('self-monitoring', 'third-party-monitoring'),
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

Fundee.hasOne(mCDR_trials);
mCDR_trials.belongsTo(Fundee);

export { Fundee, mCDR_trials };