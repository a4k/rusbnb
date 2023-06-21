from db import db


class RoomModel(db.Model):
    __tablename__ = 'Room'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    subtitle = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String(50), nullable=False)
    rate = db.Column(db.Float, nullable=False)

    def json(self):
        return {
            'id': self.id,
            'title': self.title,
            'subtitle': self.subtitle,
            'description': self.description,
            'price': self.price,
            'rate': self.rate
        }

    def update(self, title, subtitle, description, price):
        self.title = title
        self.subtitle = subtitle
        self.description = description
        self.price = price
    }
    
    @classmethod
    def find_all(cls, sort_by_cost=False):
        if sort_by_cost:
            return cls.query.order_by(cls.price.asc()).all()
        return cls.query.all()

    @classmethod
    def find_list(cls, offset, size, sort_by_cost=False):
        result = None
        if sort_by_cost:
            result = cls.query.order_by(cls.price.asc())
        else:
            result = cls.query
        
        return result.offset(offset).limit(size).all()

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
