from db import db


class RoomPhotoModel(db.Model):
    __tablename__ = 'Room-photo'

    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, nullable=False)
    format = db.Column(db.String, nullable=False)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    

    def json(self):
        return {
            'id': self.id,
            'room_id': self.room_id,
            'title': self.title,
            'description': self.description,
            'format': self.format,
            'filename': f'/server/room-images/{self.id}.{self.format}'
        }

    @classmethod
    def find_by_room_id(cls, room_id):
        return cls.query.filter_by(id=room_id).all()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
