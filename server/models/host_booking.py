from db import db


class HostFreeDatesModel(db.Model):
    __tablename__ = 'host_booking'

    id = db.Column(db.Integer, primary_key=True)
    host_id = db.Column(db.Integer)
    date_from = db.Column(db.Date)
    date_to = db.Column(db.Date)
    room_id = db.Column(db.Integer)

    def json(self):
        return {
            'id': self.id,
            'host_id': self.host_id,
            'date_from': self.date_from.isoformat(),
            'date_to': self.date_to.isoformat(),
            'room_id': self.room_id
        }

    @classmethod
    def find_by_room_id(cls, room_id):
        return cls.query.filter_by(room_id=room_id).first()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
